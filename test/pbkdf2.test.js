const Pbkdf = require('../build');
const Knex = require('knex');
const Model = require('objection').Model;
const assert = require('assert');
const crypto = require('crypto');


describe('Objection', function() {
  this.timeout(0)
  describe('Password', function() {
    describe('pbkdf2', function() {   

      beforeEach(async function() {
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
      })

      it('verifyPassword', async function() {
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
      })

      it('verifyPassword keylen:512', async function() {
        var pbkdf2 = Pbkdf({rounds: 10, keylen: 512})

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
      })

      it('verifyPassword rounds:5', async function() {
        var pbkdf2 = Pbkdf({rounds: 5})

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
      })

      var algos = crypto.getHashes();
      algos.forEach(function(algorithm) {
        it('verifyPassword digest:'+algorithm, async function() {
          var pbkdf2 = Pbkdf({digest: algorithm})

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
        })
      });

    })
  })
})
