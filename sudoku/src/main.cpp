#include <iostream>

#include "system_env.hpp"
#include "utility.inl"

static void printHelp() {
  std::cout << "Usage: ./app [options]" << std::endl;
  std::cout << "Options:" << std::endl;
  std::cout << "  -h, --help: Print help message" << std::endl;
}


int main()
{
  SetSystemEnv();

  message("Hello CMake.");
  return 0;
}
