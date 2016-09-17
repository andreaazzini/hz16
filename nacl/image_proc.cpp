#include "improc_instance.hpp"
#include "singleton_factory.hpp"
#include "url_loader_handler.hpp"
#include <vector>
#include <thread>
#include <functional>

void ImageProcInstance::HandleMessage( const pp::Var& var_message )
{
  // Interface: receive a { cmd: ..., args... } dictionary
  pp::VarDictionary var_dict( var_message );
  auto cmd = var_dict.Get( "cmd" ).AsString();

  // Message is number of simulations to run
  auto width  = var_dict.Get("width").AsInt();
  auto height = var_dict.Get("height").AsInt();
  auto data   = pp::VarArrayBuffer( var_dict.Get("data") );

  // Convert data to CMat
  // SendStatus("Casting to byte array");
  uint8_t* byteData = static_cast<uint8_t*>(data.Map());
  // SendStatus("Creating cv::Mat");
  auto Img = cv::Mat(height, width, CV_8UC4, byteData );
}
