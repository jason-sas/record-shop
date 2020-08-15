import {describe, it, beforeEach} from "@jest/globals";
import fs from "fs";
const { existsSync, mkdirSync, writeFileSync, rmdirSync } = fs;

const directories = [
    "test",
    "test/test_1",
    "test/test_2",
    "test/test_3"
];

describe("Rename tests", () => {
    beforeEach(done => {
        if(existsSync("test")) rmdirSync("test", {recursive: true});
        directories.forEach(directory => mkdirSync(directory, {recursive:true}));
        done();
    });

    it("should process rule 1", done => {
        done();
    });
});