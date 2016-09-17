# Copyright (c) 2013 The Native Client Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

#
# GNU Make based build file.  For details on GNU Make see:
# http://www.gnu.org/software/make/manual/make.html
#

#
# Get pepper directory for toolchain and includes.
#
# If NACL_SDK_ROOT is not set, then assume it can be found three directories up.
#
THIS_MAKEFILE := $(abspath $(lastword $(MAKEFILE_LIST)))
NACL_SDK_ROOT ?= $(abspath $(dir $(THIS_MAKEFILE)))

# Project Build flags
WARNINGS := -Wno-long-long -Wswitch-enum -pedantic 
CXXFLAGS := -pthread -std=gnu++14 $(WARNINGS)

#
# Compute tool paths
#
GETOS := python $(NACL_SDK_ROOT)/tools/getos.py
OSHELPERS = python $(NACL_SDK_ROOT)/tools/oshelpers.py
OSNAME := $(shell $(GETOS))
RM := $(OSHELPERS) rm

PNACL_TC_PATH := $(abspath $(NACL_SDK_ROOT)/toolchain/$(OSNAME)_pnacl)
PNACL_CXX := $(PNACL_TC_PATH)/bin/pnacl-clang++
PNACL_FINALIZE := $(PNACL_TC_PATH)/bin/pnacl-finalize
CXXFLAGS := -I/Users/emi/Projects/naclports/src/out/build/opencv/opencv-2.4.9/include -I$(NACL_SDK_ROOT)/include -std=gnu++11 
LDFLAGS := -L$(NACL_SDK_ROOT)/lib/pnacl/Release -lopencv_objdetect -lopencv_imgproc -lopencv_core -lppapi_cpp -lppapi -lz

#
# Disable DOS PATH warning when using Cygwin based tools Windows
#
CYGWIN ?= nodosfilewarning
export CYGWIN


# Declare the ALL target first, to make the 'all' target the default build
all: image_proc.pexe

clean:
	$(RM) image_proc.pexe image_proc.bc

image_proc.bc: image_proc.cc
	$(PNACL_CXX) -v -o $@ $< -O2 $(CXXFLAGS) $(LDFLAGS)

image_proc.pexe: image_proc.bc
	$(PNACL_FINALIZE) -o $@ $<


#
# Makefile target to run the SDK's simple HTTP server and serve this example.
#
HTTPD_PY := python $(NACL_SDK_ROOT)/tools/httpd.py

.PHONY: serve
serve: all
	$(HTTPD_PY) -C $(CURDIR)
