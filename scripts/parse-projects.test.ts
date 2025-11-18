import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSector } from './parse-projects';
import type { ProjectSector } from '../src/types/project';

const cases: Array<{ input: string; expected: ProjectSector }> = [
  { input: 'Chantier BTP régional', expected: 'btp' },
  { input: 'Hymne CAPEB (artisanat)', expected: 'artisanat' },
  { input: 'Zone humide / PNR', expected: 'environnement' },
  { input: 'Association d\'insertion', expected: 'economie-sociale' },
  { input: 'Mobilité douce en centre-ville', expected: 'mobilite' },
  { input: 'Patrimoine en Anjou', expected: 'patrimoine' },
  { input: 'Territoire institutionnel', expected: 'territoire' },
  { input: 'Coopérative agricole', expected: 'agriculture' },
  { input: 'Spectacle vivant immersif', expected: 'spectacle-vivant' },
  { input: 'Festival associatif', expected: 'vie-associative' },
];

for (const scenario of cases) {
  test(`normalizeSector: ${scenario.input}`, () => {
    const result = normalizeSector(scenario.input);
    assert.equal(result, scenario.expected);
  });
}
