import {
    Field,
    SmartContract,
    state,
    State,
    method,
    DeployArgs,
    Permissions,
    PublicKey,
    Signature,
    PrivateKey,
  } from 'snarkyjs';
  
  // The public key of our trusted data provider
  const ORACLE_PUBLIC_KEY =
    'B62qoAE4rBRuTgC42vqvEyUqCGhaZsW58SKVW4Ht8aYqP9UTvxFWBgy';
  
  export class OracleExample extends SmartContract {
    // Define contract state
    @state(PublicKey) oraclePublicKey = State<PublicKey>();

  
    // Define contract events
    events = {
        verified: Field,
      };

    deploy(args: DeployArgs) {
      super.deploy(args);
      this.setPermissions({
        ...Permissions.default(),
        editState: Permissions.proofOrSignature(),
      });
      this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    }
  
    @method verify(id: Field, creditScore: Field, signature: Signature) {
      // Get the oracle public key from the contract state
        const oraclePublicKey = this.oraclePublicKey.get();
        this.oraclePublicKey.assertEquals(oraclePublicKey);

      // Evaluate whether the signature is valid for the provided data
        const validSignature = signature.verify(oraclePublicKey, [id, creditScore]);

      // Check that the provided email hash is greater than 700
      // Let's assume that if a hash is greater then 700, then it is part of the saved database of valid hashes from emails
        creditScore.assertGte(Field(700));
      // Emit an event containing the verified users id
        this.emitEvent('verified', id);
    }
  }