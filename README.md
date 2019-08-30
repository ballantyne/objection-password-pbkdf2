# objection-password-pbkdf2

I decided to write this plugin because after mining bitcoin for a while I have started to think it is good to have options about what algorithm you use for encrypting passwords.  This library also uses the standard lib, so it doesn't rely on any other dependencies.

```bash
  npm install objection-password-pbkdf2 --save
```

### Usage

Here is how to use this module with an objection model;

```javascript
  const Pbkdf  = require('objection-password-pbkdf2');
  const Knex   = require('knex');
  const Model  = require('objection').Model;
  const assert = require('assert');

  const knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true
  });

  Model.knex(knex);
  await knex.schema.createTable('people', (table) => {
    table.increments();
    table.string('name');
    table.string('password');
    table.string('salt');
  });

  var pbkdf2 = Pbkdf()

  class Person extends pbkdf2(Model) {
    static get tableName () {
      return 'people';
    }
  }
  var person = await Person.query().insert({
    name: 'person', 
    password: 'person'
  });
  assert.equal(person.verifyPassword('person'), true);
```

Here is an example with options.  This example is very slow and will take much longer to crack.

```javascript
  var pbkdf2 = Pbkdf({rounds: 20, keylen: 512})

  class Person extends pbkdf2(Model) {
    static get tableName () {
      return 'people';
    }
  }
  var person = await Person.query().insert({
    name: 'person', 
    password: 'person'
  });
  assert.equal(person.verifyPassword('person'), true);
```

If you don't want to encrypt your password with sha512 use this function to see what algorithms are available.  Apparently the not all the algorithms are implemented in every version of node, so run the tests to see which are available and how slow they are.

```javascript
  var crypto = require('crypto');
> crypto.getHashes()
[
  'RSA-MD4',
  'RSA-MD5',
  'RSA-MDC2',
  'RSA-RIPEMD160',
  'RSA-SHA1',
  'RSA-SHA1-2',
  'RSA-SHA224',
  'RSA-SHA256',
  'RSA-SHA3-224',
  'RSA-SHA3-256',
  'RSA-SHA3-384',
  'RSA-SHA3-512',
  'RSA-SHA384',
  'RSA-SHA512',
  'RSA-SHA512/224',
  'RSA-SHA512/256',
  'RSA-SM3',
  'blake2b512',
  'blake2s256',
  'id-rsassa-pkcs1-v1_5-with-sha3-224',
  'id-rsassa-pkcs1-v1_5-with-sha3-256',
  'id-rsassa-pkcs1-v1_5-with-sha3-384',
  'id-rsassa-pkcs1-v1_5-with-sha3-512',
  'md4',
  'md4WithRSAEncryption',
  'md5',
  'md5-sha1',
  'md5WithRSAEncryption',
  'mdc2',
  'mdc2WithRSA',
  'ripemd',
  'ripemd160',
  'ripemd160WithRSA',
  'rmd160',
  'sha1',
  'sha1WithRSAEncryption',
  'sha224',
  'sha224WithRSAEncryption',
  'sha256',
  'sha256WithRSAEncryption',
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'sha384',
  'sha384WithRSAEncryption',
  'sha512',
  'sha512-224',
  'sha512-224WithRSAEncryption',
  'sha512-256',
  'sha512-256WithRSAEncryption',
  'sha512WithRSAEncryption',
  'sm3',
  'sm3WithRSAEncryption',
  'ssl3-md5',
  'ssl3-sha1',
  'whirlpool'
]  
```

Once you choose one of the algorithms above, you can set the digest option like this.
```javascript
  var pbkdf2 = Pbkdf({digest: 'blake2b512', keylen: 512})

  class Person extends pbkdf2(Model) {
    static get tableName () {
      return 'people';
    }
  }
  var person = await Person.query().insert({
    name: 'person', 
    password: 'person'
  });
  assert.equal(person.verifyPassword('person'), true);

```

Contributing
------------

If you'd like to contribute a feature or bugfix: Thanks! To make sure your fix/feature has a high chance of being included, please read the following guidelines:

1. Post a [pull request](https://github.com/ballantyne/objection-password-pbkdf2/compare/).
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for objection-password-pbdkf2, please open a
   [GitHub issue](https://github.com/ballantyne/objection-password-pbkdf2/issues/new).

And once there are some contributors, then I would like to thank all of [the contributors](https://github.com/ballantyne/objection-password-pbkdf2/graphs/contributors)!

License
-------

It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

Copyright
-------
© 2019 Scott Ballantyne. See LICENSE for details.
