const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const Messenger = require("../../models/messenger");

const apiId = process.env.TELEGRAM_API_ID;
const apiHash = process.env.TELEGRAM_API_HASH;
let globalPhoneCodePromise;
let clientStartPromise;
function generatePromise() {
  let resolve, reject;
  let promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { resolve, reject, promise };
}

exports.login = async (req, res, next) => {
  const setupStep = req.body.setupStep;
  const phoneNumber = req.body.phoneNumber;
  const obtainedCode = req.body.code;

  if (setupStep == 1) {
    client = new TelegramClient(new StringSession(""), Number(apiId), apiHash, {
      connectionRetries: 5,
    });

    globalPhoneCodePromise = generatePromise();
    clientStartPromise = client.start({
      phoneNumber: phoneNumber,
      phoneCode: async () => {
        let code = await globalPhoneCodePromise.promise;
        globalPhoneCodePromise = generatePromise();
        return code;
      },
    });
    res.json({
      status: "ok",
      setupStep: 1,
    });
  } else if (setupStep == 2) {
    globalPhoneCodePromise.resolve(obtainedCode);
    clientStartPromise
      .then(() => {
        console.log("You should now be connected.");
        const messenger = new Messenger({
          type: "Telegram",
          phoneNumber: phoneNumber,
          sessionString: client.session.save(),
          userId: req.userId,
        });
        messenger.save();

        return res.json({
          status: "ok",
          setupStep: 2,
          messenger: messenger,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.getChats = async (req, res, next) => {
  const messengerId = req.params.messengerId;
  Messenger.findById(messengerId)
    .then((messenger) => {
      return messenger.sessionString;
    })
    .then((sessionString) => {
      return new TelegramClient(
        new StringSession(sessionString),
        Number(apiId),
        apiHash,
        {}
      );
    })
    .then(async (client) => {
      await client.connect();
      return client;
    })
    .then((client) => {
      return client.invoke(new Api.messages.GetAllChats({exceptIds:[]}));
    })
    .then((result) => {
      res.status(200).json(result);
    });
};
