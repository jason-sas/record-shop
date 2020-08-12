import wish from 'wish';
import { test, intersection } from 'ramda';
import { isWindowsDuplicate } from './dedupe';


describe('Dedupe unit tests', () => {
   it('should be a Windows duplicate', done => {
    wish(isWindowsDuplicate('C:\\Users\\Downloads\\Korina Kova (22).mp3'));   
    done();
   });
   
   it('should process a directory with no subfolders correctly', done => {
    done();
   });

   it('should process a directory containing subfolders recursively with flag', done => {
    done();
   });

   it('should process a directory containing subfolders non-recursively without the flag', done => {
       done();
   });
});