#pragma once

#include <iostream>
#include <sstream>
#include <vector>

#include "block.hpp"
#include "command.hpp"
#include "common.hpp"

// 数独场景类
class CScene {
 public:
  CScene(int index = 3);
  virtual ~CScene();

  void generate();
  void show() const;

  bool setCurValue(const int nCurValue, int& nLastValue);
  bool setPointValue(const point_t&, const int);
  point_t getCurPoint();

  void eraseRandomGrids(const int count);
  bool isComplete();

  void play();
  bool save(const char* filename);
  bool load(const char* filename);

  void setMode(KeyMode mode);

 private:
  void init();  // 将每个格子的指针放到block里面
  void setValue(const int);
  void setValue(const point_t&, const int);
  void printUnderline(std::ostringstream& buffer, int line_no = -1) const;

 private:
  KeyMap* keyMap{};
  int _max_column;
  point_t _cur_point;
  CBlock _column_block[9];
  CBlock _row_block[9];
  CBlock _xy_block[3][3];
  point_value_t _map[81];

  std::vector<CCommand> _vCommand;
};
