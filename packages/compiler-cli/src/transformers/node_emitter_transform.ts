/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {GeneratedFile} from '@angular/compiler';
import * as ts from 'typescript';

import {TypeScriptNodeEmitter} from './node_emitter';
import {GENERATED_FILES} from './util';

const PREAMBLE = `/**
* @fileoverview This file is generated by the Angular template compiler.
* Do not edit.
* @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride}
* tslint:disable
*/`;

export function getAngularEmitterTransformFactory(generatedFiles: Map<string, GeneratedFile>): () =>
    (sourceFile: ts.SourceFile) => ts.SourceFile {
  return function() {
    const emitter = new TypeScriptNodeEmitter();
    return function(sourceFile: ts.SourceFile): ts.SourceFile {
      const g = generatedFiles.get(sourceFile.fileName);
      if (g && g.stmts) {
        const [newSourceFile] = emitter.updateSourceFile(sourceFile, g.stmts, PREAMBLE);
        return newSourceFile;
      } else if (GENERATED_FILES.test(sourceFile.fileName)) {
        return ts.updateSourceFileNode(sourceFile, []);
      }
      return sourceFile;
    };
  };
}