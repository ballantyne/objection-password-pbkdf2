import { 
  pbkdf2, 
  pbkdf2Sync, 
  randomBytes 
} from 'crypto';

import objection from 'objection/typings/objection';

const ROUNDS = 12;

interface PluginOptions {
  passwordField?: string;
  saltField?: string;
  rounds?: number;
  keylen?: number;
  digest?: string;
  multiplier?: number;
}

module.exports = (options:PluginOptions) => {
  options = Object.assign({
    passwordField: 'password',
    saltField: 'salt',
    rounds: ROUNDS,
    keylen: 64,
    digest: 'sha512',
    multiplier: 100000
  }, options);

  options.rounds = options.rounds * options.multiplier;

  return (Model: objection.ModelClass<any>) => {
    return class extends Model {

      $beforeInsert(context:objection.QueryContext) {
        var self = this;
        const toResolve = super.$beforeInsert(context);
        
        return Promise.resolve(toResolve).then(() => {
          return self.generateHash();
        }); 
      }

      $beforeUpdate(query:objection.ModelOptions, context:objection.QueryContext) {
        var self = this;
        const toResolve = super.$beforeUpdate(query, context);
        return Promise.resolve(toResolve).then(() => {
          if (query.patch && self[options.passwordField] === undefined) {
            return;
          }
          
          return self.generateHash();
        });       
      }
      
      verifyPassword (password:string) {
        var hash = pbkdf2Sync(password, 
          this.salt, 
          options.rounds, 
          options.keylen, 
          options.digest).toString('hex')
        
        return hash == this.password;  
      }

      generateHash () {
        var self = this;
        return new Promise((resolve, reject) => {
          if (self[options.saltField] == undefined) {
            self[options.saltField] = randomBytes(16).toString('hex');
          }
          
          var password = self[options.passwordField];
          if (password == undefined) {
            reject();
          } else {
            pbkdf2(self[options.passwordField], 
              self[options.saltField], 
              options.rounds, 
              options.keylen, 
              options.digest, 
            (err, hash) => {

              if (err) {
                reject(err);
              } else {
                self[options.passwordField] = hash.toString('hex');
                resolve();
              }

            })       
          }
        });

      }

    }
  }
}
