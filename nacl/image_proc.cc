// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include <ppapi/cpp/instance.h>
#include <ppapi/cpp/module.h>
#include <ppapi/cpp/var.h>
#include <ppapi/cpp/var_dictionary.h>
#include <ppapi/cpp/var_array_buffer.h>

#include <opencv2/core/core.hpp>


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

    auto img = cv::Mat(height, width, CV_8UC4, byteData);

    cv::Vec4b v = img.at<cv::Vec4b>(height / 2, width / 2);

    printf("Received message");
    pp::Var var_reply(v[0] + v[1] * 1000 + v[2] * 1000000);
    PostMessage(var_reply);
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
  printf("Image proc init'ing");
  return new ImageProcModule();
}

}  // namespace pp
