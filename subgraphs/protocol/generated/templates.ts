// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext,
} from "@graphprotocol/graph-ts";

export class Singularity extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("Singularity", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "Singularity",
      [address.toHex()],
      context,
    );
  }
}

export class BigBang extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("BigBang", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("BigBang", [address.toHex()], context);
  }
}
