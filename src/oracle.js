const Koa = require("koa");
const Router = require("@koa/router");
const { isReady, PrivateKey, Field, Signature } = require("snarkyjs");

const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

async function getSignedEmail(userId) {
  // We need to wait for SnarkyJS to finish loading before we can do anything
  await isReady;

  // The private key of our account. When running locally the hardcoded key will
  // be used. In production the key will be loaded from a Vercel environment
  // variable.
  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
      "EKDwS4UV9L8hyd8itS95HTpH6D3rhdWrfamYqbb44mzr2UpND2F1"
  );

  // We map the user's email to a hash that we keep track of. Let's imagine the first user is 787, and the 536 is anyone else. 
  const knownCreditScore = (userId) => (userId === "1" ? 787 : 536);

  // We compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();

  // Define a Field with the value of the users id
  const id = Field(userId);

  // Define a Field with the users hash value
  const emailHash = Field(knownHash(userId));

  // Use our private key to sign an array of Fields containsing the users id and
  // credit score
  const signature = Signature.create(privateKey, [id, emailHash]);

  return {
    data: { id: id, emailHash: emailHash },
    signature: signature,
    publicKey: publicKey,
  };
}

router.get("/user/:id", async (ctx) => {
  ctx.body = await getSignedEmail(ctx.params.id);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT);