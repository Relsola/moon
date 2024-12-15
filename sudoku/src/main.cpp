#include <cstring>
#include <iostream>

#include "i18n.hpp"
#include "input.hpp"
#include "scene.hpp"
#include "system_env.hpp"
#include "utility.inl"

static void printHelp() {
  using std::cout;

  cout << "\nsudoku - a little game in command line\n\n";
  cout << "Usage:\n";
  cout << "\t sudoku [-l <progressFile>]\n\n";
  cout << "Options:\n";
  cout
      << "\t -l <path> \t specify path of progress file to load, optional.\n\n";
}

int main(int argc, char** argv) {
  SetSystemEnv();

  CScene scene;

  if (argc == 1) {
    InputLanguage();
    int eraseGridNumber = inputDifficulty();
    scene.generate();
    scene.eraseRandomGrids(eraseGridNumber);
  } else if (argc == 3 && !strcmp(argv[1], "-l")) {
    // load saved game progress
    if (!scene.load(argv[2])) {
      message(I18n::Instance().Get(I18n::Key::LOAD_PROGRESS_FAIL));
      return 0;
    }
    InputLanguage();
  } else {
    printHelp();
    return 0;
  }

  scene.setMode(inputKeyMode());

  scene.play();

  return 0;
}
