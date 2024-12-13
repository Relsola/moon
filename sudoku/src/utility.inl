#pragma once

#include <cassert>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <string>

inline unsigned int random(int begin, int end) {
  assert(end >= begin && begin >= 0);
  srand(time(nullptr));
  return (unsigned int)rand() % (end - begin + 1) + begin;
}


inline void message(const char* msg = "", bool lf = true) {
  std::cout << msg;
  if (lf) std::cout << std::endl;
}

inline void message(const std::string& msg, bool lf = true) {
  message(msg.c_str(), lf);
}

inline void cls(void) {
#ifdef _WIN32
  system("cls");
#else
  system("clear");
#endif
}
