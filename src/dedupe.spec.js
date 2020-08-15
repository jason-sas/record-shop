import {describe, it, beforeEach} from "@jest/globals";
import wish from "wish";
import { forEach, find } from "ramda";
import { deleteFile, isWindowsDuplicateMP3, processDir } from "./dedupe";
import fs from "fs";


const { existsSync, mkdirSync, writeFileSync, rmdirSync } = fs;

describe("Dedupe unit tests", () => {
  const directories = [
    "test",
    "test",
    "test/test_1",
    "test/test_2",
    "test/test_3",
    "test/test_2/subdirectory_1",
    "test/test_2/subdirectory_2",
    "test/test_3/subdirectory_1",
    "test/test_3/subdirectory_2",
  ];
  let files = ["a.mp3", "a (1).mp3", "a (2).mp3", "b.mp3"];

  beforeEach((done) => {
    if (existsSync("./test")) rmdirSync("./test", { recursive: true });

    const makeFiles = function _makeFiles(path) {
      forEach((file) => {
        writeFileSync(`${path}/${file}`, "This is a test.");
      }, files);
    };

    forEach((directory) => {
      mkdirSync(directory, { recursive: true });
      makeFiles(directory);
    }, directories);

    done();
  });

  it("should be a Windows duplicate", (done) => {
    wish(isWindowsDuplicateMP3("/Users/Downloads/a (22).mp3"));
    done();
  });

  it("should delete a file", (done) => {
    deleteFile("test/test_1/a.mp3");
    wish(!existsSync("test/test_1/a.mp3"));
    done();
  });

  it("should process a directory with no subfolders correctly", async (done) => {
    const processedFiles = await processDir(
      isWindowsDuplicateMP3,
      deleteFile,
      false,
      "test/test_1"
    );
    wish(!existsSync("test/test_1/a (1).mp3"));
    wish(!existsSync("test/test_1/a (2).mp3"));
    wish(existsSync("test/test_1/a.mp3"));
    wish(existsSync("test/test_1/b.mp3"));
    done();
  });

  it("should process a directory containing subfolders recursively with flag", async (done) => {
    const processedFiles = await processDir(
      isWindowsDuplicateMP3,
      deleteFile,
      true,
      "/mnt/c/"
    );
    wish(!existsSync("test/test_2/a (1).mp3"));
    wish(!existsSync("test/test_2/a (2).mp3"));
    wish(existsSync("test/test_2/a.mp3"));
    wish(existsSync("test/test_2/b.mp3"));
    wish(!existsSync("test/test_2/subdirectory_1/a (1).mp3"));
    wish(!existsSync("test/test_2/subdirectory_1/a (2).mp3"));
    wish(existsSync("test/test_2/subdirectory_1/a.mp3"));
    wish(existsSync("test/test_2/subdirectory_1/b.mp3"));
    wish(!existsSync("test/test_2/subdirectory_2/a (1).mp3"));
    wish(!existsSync("test/test_2/subdirectory_2/a (2).mp3"));
    wish(existsSync("test/test_2/subdirectory_2/a.mp3"));
    wish(existsSync("test/test_2/subdirectory_2/b.mp3"));
    done();
  });

  it("should process a directory containing subfolders non-recursively without the flag", async (done) => {
    const processedFiles = await processDir(
      isWindowsDuplicateMP3,
      deleteFile,
      false,
      "test/test_3"
    );
    wish(!existsSync("test/test_3/a (1).mp3"));
    wish(!existsSync("test/test_3/a (2).mp3"));
    wish(existsSync("test/test_3/a.mp3"));
    wish(existsSync("test/test_3/b.mp3"));
    wish(existsSync("test/test_3/subdirectory_1/a (1).mp3"));
    wish(existsSync("test/test_3/subdirectory_1/a (2).mp3"));
    wish(existsSync("test/test_3/subdirectory_1/a.mp3"));
    wish(existsSync("test/test_3/subdirectory_1/b.mp3"));
    wish(existsSync("test/test_3/subdirectory_2/a (1).mp3"));
    wish(existsSync("test/test_3/subdirectory_2/a (2).mp3"));
    wish(existsSync("test/test_3/subdirectory_2/a.mp3"));
    wish(existsSync("test/test_3/subdirectory_2/b.mp3"));
    done();
  });
});
