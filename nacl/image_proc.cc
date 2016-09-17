// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include <ppapi/cpp/instance.h>
#include <ppapi/cpp/module.h>
#include <ppapi/cpp/var.h>
#include <ppapi/cpp/var_dictionary.h>
#include <ppapi/cpp/var_array_buffer.h>


class ImageProcInstance : public pp::Instance {
 public:
  explicit ImageProcInstance(PP_Instance instance)
      : pp::Instance(instance) {}
  virtual ~ImageProcInstance() {}

  virtual void HandleMessage(const pp::Var& var_message) {
	pp::VarDictionary var_dict( var_message );

	// Message is number of simulations to run
	//auto data = pp::VarArrayBuffer( var_dict.Get("data") );
	auto width = var_dict.Get("width").AsInt();
	auto height = var_dict.Get("height").AsInt();
    printf("Received message");
    pp::Var var_reply(width * height);
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
