import { Field, SmartContract, State, DeployArgs, PublicKey, Signature } from 'snarkyjs';
export declare class OracleExample extends SmartContract {
    oraclePublicKey: State<PublicKey>;
    events: {
        verified: typeof Field;
    };
    deploy(args: DeployArgs): void;
    verify(id: Field, creditScore: Field, signature: Signature): void;
}
