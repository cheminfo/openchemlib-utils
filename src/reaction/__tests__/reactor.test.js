import OCL from 'openchemlib';
import { describe, it, expect } from 'vitest';

// tree can be debug using https://my.cheminfo.org/?viewURL=https%3A%2F%2Fmyviews.cheminfo.org%2Fdb%2Fvisualizer%2Fentry%2Fbd04a6cedc05e54275bc62a29dd0a0cd%2Fview.json

describe('Reactions', () => {
  it('fail water loss', () => {
    const reaction = OCL.ReactionEncoder.decode(
      'eMHAIhH!eF@HhP#QF Qd#!R_vq?DqtJ_@ !R@Fp]Agp',
    );

    const reactor = new OCL.Reactor(reaction);

    const match = reactor.setReactant(
      0,
      OCL.Molecule.fromSmiles('C=C(O)C(C)(C)C'),
    );
    if (!match) return;

    const products = reactor.getProducts();
    for (const product of products) {
      for (const molecule of product) {
        console.log(molecule.toSmiles());
      }
    }
  });
});
