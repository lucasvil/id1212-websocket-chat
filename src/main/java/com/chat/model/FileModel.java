package com.chat.model;

public class FileModel {
  private String file;
  private String from;

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

  @Override
  public String toString() {
    return "FileModel{file='" + file + '\'' + ", from='" + from + '\'' + "}";
  }
}
