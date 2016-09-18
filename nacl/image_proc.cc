// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file. 

#include <chrono>
#include <sstream>
#include <ppapi/cpp/instance.h>
#include <ppapi/cpp/module.h>
#include <ppapi/cpp/var.h>
#include <ppapi/cpp/var_dictionary.h>
#include <ppapi/cpp/var_array_buffer.h>

#include <opencv2/core/core.hpp>

#include "../../eyelike/src/classify.hpp" 

std::string printMeasureInfo(MeasureInfo &bestSmall, MeasureInfo &bestLarge, std::string name) {
    using namespace std::chrono;
    long ms = duration_cast< milliseconds >(
    system_clock::now().time_since_epoch()
    ).count();

    std::ostringstream output; 
    output << name << ", " <<
    ms << ", " <<
    bestLarge.x << ", " <<
    bestLarge.y << ", " <<
    bestLarge.r1 << ", " <<
    bestLarge.r2 << ", " <<
    bestLarge.matches << ", " <<
    bestLarge.rejects << ", " <<
    bestLarge.avg << ", " <<
    bestSmall.matches << ", " <<
    bestSmall.rejects << ", " <<
    bestSmall.avg;

    return output.str();
}

class ImageProcInstance : public pp::Instance {
 public:
  explicit ImageProcInstance(PP_Instance instance)
      : pp::Instance(instance) {}
  virtual ~ImageProcInstance() {}

  virtual void HandleMessage(const pp::Var& var_message) {
	pp::VarDictionary var_dict( var_message );

	// Message is number of simulations to run
	auto data = pp::VarArrayBuffer(var_dict.Get("data"));
	auto width = var_dict.Get("width").AsInt();
	auto height = var_dict.Get("height").AsInt();

    uchar* byteData = static_cast<uchar*>(data.Map());

    cv::Mat img; 
    cvtColor(cv::Mat(height, width, CV_8UC4, byteData), img, CV_RGBA2BGR);

    MeasureInfo leftSmall, leftLarge, rightSmall, rightLarge;

    detectAndDisplay(img, leftSmall, leftLarge, rightSmall, rightLarge);

    using namespace std::chrono;
    long ms = duration_cast< milliseconds >(
        system_clock::now().time_since_epoch()
    ).count();

    pp::Var var_reply(printMeasureInfo(leftSmall, leftLarge, "left"));
    PostMessage(var_reply);
    pp::Var var_reply2(printMeasureInfo(rightSmall, rightLarge, "right"));
    PostMessage(var_reply2);
   //PostMessage
  }
};

class ImageProcModule : public pp::Module {
 public:
  ImageProcModule() : pp::Module() {}
  virtual ~ImageProcModule() {}

  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new ImageProcInstance(instance);
  }
};

namespace pp {

Module* CreateModule() {
  ClassifyInit();
  printf("Image proc init'ing");
  return new ImageProcModule();
}

}  // namespace pp
