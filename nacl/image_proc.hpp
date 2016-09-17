#ifndef IMAGE_PROC_HPP
#define IMAGE_PROC_HPP

#include <opencv2/core/core.hpp>

#include "singleton_factory.hpp"
#include "instance_factory.hpp"
#include "image_proc.hpp"
#include "ppapi/cpp/var_dictionary.h"
#include "ppapi/cpp/var_array.h"
#include "ppapi/cpp/var_array_buffer.h"
#include "ppapi/utility/completion_callback_factory.h"
#include "ppapi/utility/threading/simple_thread.h"

// The ImageProcInstance that stores
class ImageProcInstance : public pp::Instance {
  public:
    virtual void HandleMessage( const pp::Var& );
};

#endif
