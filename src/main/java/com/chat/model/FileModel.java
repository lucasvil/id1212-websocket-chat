package com.chat.model;

public class FileModel {
  private String file;
  private String from;
  private String base64;

  public String getFile() {
    return this.file;
  }

  public void setFile(String file) {
    this.file = file;
  }

  public String getFrom() {
    return this.from;
  }

  public void setFrom(String from) {
    this.from = from;
  }

  public void setBase64(String base64) {
    this.base64 = base64;
  }

  public String getBase64() {
    return this.base64;
  }

  @Override
  public String toString() {
    return "FileModel{file='" + file + '\'' + ", from='" + from + '\'' + ", base64='" + base64 + '\'' + "}";
  }
}
