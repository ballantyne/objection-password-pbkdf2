"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const ROUNDS = 12;
module.exports = (options) => {
    options = Object.assign({
        passwordField: 'password',
        saltField: 'salt',
        rounds: ROUNDS,
        keylen: 64,
        digest: 'sha512',
        multiplier: 100000
    }, options);
    options.rounds = options.rounds * options.multiplier;
    return (Model) => {
        return class extends Model {
            $beforeInsert(context) {
                var self = this;
                const toResolve = super.$beforeInsert(context);
                return Promise.resolve(toResolve).then(() => {
                    return self.generateHash();
                });
            }
            $beforeUpdate(query, context) {
                var self = this;
                const toResolve = super.$beforeUpdate(query, context);
                return Promise.resolve(toResolve).then(() => {
                    if (query.patch && self[options.passwordField] === undefined) {
                        return;
                    }
                    return self.generateHash();
                });
            }
            verifyPassword(password) {
                var hash = crypto_1.pbkdf2Sync(password, this.salt, options.rounds, options.keylen, options.digest).toString('hex');
                return hash == this.password;
            }
            generateHash() {
                var self = this;
                return new Promise((resolve, reject) => {
                    if (self[options.saltField] == undefined) {
                        self[options.saltField] = crypto_1.randomBytes(16).toString('hex');
                    }
                    var password = self[options.passwordField];
                    if (password == undefined) {
                        reject();
                    }
                    else {
                        crypto_1.pbkdf2(self[options.passwordField], self[options.saltField], options.rounds, options.keylen, options.digest, (err, hash) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                self[options.passwordField] = hash.toString('hex');
                                resolve();
                            }
                        });
                    }
                });
            }
        };
    };
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxFQUNkLE9BQU8sQ0FBQyxNQUFNLEVBQ2hCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFOzRCQUVaLElBQUksR0FBRyxFQUFFO2dDQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDYjtpQ0FBTTtnQ0FDTCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ25ELE9BQU8sRUFBRSxDQUFDOzZCQUNYO3dCQUVILENBQUMsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBRUwsQ0FBQztTQUVGLENBQUE7SUFDSCxDQUFDLENBQUE7QUFDSCxDQUFDLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBcbiAgcGJrZGYyLCBcbiAgcGJrZGYyU3luYywgXG4gIHJhbmRvbUJ5dGVzIFxufSBmcm9tICdjcnlwdG8nO1xuXG5pbXBvcnQgb2JqZWN0aW9uIGZyb20gJ29iamVjdGlvbi90eXBpbmdzL29iamVjdGlvbic7XG5cbmNvbnN0IFJPVU5EUyA9IDEyO1xuXG5pbnRlcmZhY2UgUGx1Z2luT3B0aW9ucyB7XG4gIHBhc3N3b3JkRmllbGQ/OiBzdHJpbmc7XG4gIHNhbHRGaWVsZD86IHN0cmluZztcbiAgcm91bmRzPzogbnVtYmVyO1xuICBrZXlsZW4/OiBudW1iZXI7XG4gIGRpZ2VzdD86IHN0cmluZztcbiAgbXVsdGlwbGllcj86IG51bWJlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAob3B0aW9uczpQbHVnaW5PcHRpb25zKSA9PiB7XG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBwYXNzd29yZEZpZWxkOiAncGFzc3dvcmQnLFxuICAgIHNhbHRGaWVsZDogJ3NhbHQnLFxuICAgIHJvdW5kczogUk9VTkRTLFxuICAgIGtleWxlbjogNjQsXG4gICAgZGlnZXN0OiAnc2hhNTEyJyxcbiAgICBtdWx0aXBsaWVyOiAxMDAwMDBcbiAgfSwgb3B0aW9ucyk7XG5cbiAgb3B0aW9ucy5yb3VuZHMgPSBvcHRpb25zLnJvdW5kcyAqIG9wdGlvbnMubXVsdGlwbGllcjtcblxuICByZXR1cm4gKE1vZGVsOiBvYmplY3Rpb24uTW9kZWxDbGFzczxhbnk+KSA9PiB7XG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgTW9kZWwge1xuXG4gICAgICAkYmVmb3JlSW5zZXJ0KGNvbnRleHQ6b2JqZWN0aW9uLlF1ZXJ5Q29udGV4dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHRvUmVzb2x2ZSA9IHN1cGVyLiRiZWZvcmVJbnNlcnQoY29udGV4dCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRvUmVzb2x2ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZ2VuZXJhdGVIYXNoKCk7XG4gICAgICAgIH0pOyBcbiAgICAgIH1cblxuICAgICAgJGJlZm9yZVVwZGF0ZShxdWVyeTpvYmplY3Rpb24uTW9kZWxPcHRpb25zLCBjb250ZXh0Om9iamVjdGlvbi5RdWVyeUNvbnRleHQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCB0b1Jlc29sdmUgPSBzdXBlci4kYmVmb3JlVXBkYXRlKHF1ZXJ5LCBjb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0b1Jlc29sdmUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGlmIChxdWVyeS5wYXRjaCAmJiBzZWxmW29wdGlvbnMucGFzc3dvcmRGaWVsZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICByZXR1cm4gc2VsZi5nZW5lcmF0ZUhhc2goKTtcbiAgICAgICAgfSk7ICAgICAgIFxuICAgICAgfVxuICAgICAgXG4gICAgICB2ZXJpZnlQYXNzd29yZCAocGFzc3dvcmQ6c3RyaW5nKSB7XG4gICAgICAgIHZhciBoYXNoID0gcGJrZGYyU3luYyhwYXNzd29yZCwgXG4gICAgICAgICAgdGhpcy5zYWx0LCBcbiAgICAgICAgICBvcHRpb25zLnJvdW5kcywgXG4gICAgICAgICAgb3B0aW9ucy5rZXlsZW4sIFxuICAgICAgICAgIG9wdGlvbnMuZGlnZXN0KS50b1N0cmluZygnaGV4JylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBoYXNoID09IHRoaXMucGFzc3dvcmQ7ICBcbiAgICAgIH1cblxuICAgICAgZ2VuZXJhdGVIYXNoICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGlmIChzZWxmW29wdGlvbnMuc2FsdEZpZWxkXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNlbGZbb3B0aW9ucy5zYWx0RmllbGRdID0gcmFuZG9tQnl0ZXMoMTYpLnRvU3RyaW5nKCdoZXgnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgdmFyIHBhc3N3b3JkID0gc2VsZltvcHRpb25zLnBhc3N3b3JkRmllbGRdO1xuICAgICAgICAgIGlmIChwYXNzd29yZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYmtkZjIoc2VsZltvcHRpb25zLnBhc3N3b3JkRmllbGRdLCBcbiAgICAgICAgICAgICAgc2VsZltvcHRpb25zLnNhbHRGaWVsZF0sIFxuICAgICAgICAgICAgICBvcHRpb25zLnJvdW5kcywgXG4gICAgICAgICAgICAgIG9wdGlvbnMua2V5bGVuLCBcbiAgICAgICAgICAgICAgb3B0aW9ucy5kaWdlc3QsIFxuICAgICAgICAgICAgKGVyciwgaGFzaCkgPT4ge1xuXG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmW29wdGlvbnMucGFzc3dvcmRGaWVsZF0gPSBoYXNoLnRvU3RyaW5nKCdoZXgnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSkgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgfVxuICB9XG59XG4iXX0=
