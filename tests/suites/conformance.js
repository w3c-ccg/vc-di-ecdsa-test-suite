/*!
 * Copyright 2024 Digital Bazaar, Inc.
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {
  assertions,
  generators,
  issueCloned
} from 'data-integrity-test-suite-assertion';
import {getMultiKey} from '../vc-generator/key-gen.js';

export function assertConformance({
  verifiers,
  suiteName,
  keyType,
  vcVersion,
  credential,
  setup = _setup
}) {
  describe(`${suiteName} - Conformance - VC ${vcVersion}`, function() {
    this.matrix = true;
    this.report = true;
    this.implemented = [...verifiers];
    this.rowLabel = 'Test Name';
    this.columnLabel = 'Implementation';
    let credentials = new Map();
    before(async function() {
      credentials = await setup({credential, suiteName, keyType});
    });
    for(const [name, {endpoints}] of verifiers) {
      const [verifier] = endpoints;
      describe(`${name}: ${keyType}`, function() {
        beforeEach(function() {
          this.currentTest.cell = {
            rowId: this.currentTest.title,
            columnId: this.currentTest.parent.title
          };
        });
        it('Specifically, all relevant normative statements in Sections 2. ' +
        'Data Model and 3. Algorithms of this document MUST be enforced.',
        async function() {
          this.test.link = 'https://w3c.github.io/vc-di-ecdsa/#:~:text=Specifically%2C%20all%20relevant%20normative%20statements%20in%20Sections%202.%20Data%20Model%20and%203.%20Algorithms%20of%20this%20document%20MUST%20be%20enforced.';
        });
        it('Conforming processors MUST produce errors when non-conforming ' +
        'documents are consumed.', async function() {
          this.test.link = 'https://w3c.github.io/vc-di-ecdsa/#:~:text=Conforming%20processors%20MUST%20produce%20errors%20when%20non%2Dconforming%20documents%20are%20consumed.';
          for(const [key, credential] of credentials) {
            await assertions.verificationFail({
              verifier,
              credential,
              reason: `Should not verify VC with ${key}`
            });
          }
        });
      });
    }
  });
}
async function _setup({
  credential,
  suiteName,
  keyType,
  cryptosuite,
  mandatoryPointers,
  selectivePointers
}) {
  const {
    invalidProofType,
    invalidVm,
    invalidCryptosuite
  } = generators?.mandatory;
  const credentials = new Map();
  const keyPair = await getMultiKey({keyType});
  const signer = keyPair.signer();
  // not bs58 encoded verificationMethod via invalidVm
  // type is not DataIntegrityProof invalidType
  // invalid cryptosuite name invalidCryptosuite
  credentials.set('invalidCryptosuite', await issueCloned(invalidCryptosuite({

  })));
  credentials.set('invalidVerificationMethod', await issueCloned(invalidVm({

  })));
  credentials.set('invalidProofType', await issueCloned(invalidProofType({

  })));
  return credentials;
}
