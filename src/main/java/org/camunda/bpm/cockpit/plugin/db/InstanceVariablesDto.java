package org.camunda.bpm.cockpit.plugin.db;

public class InstanceVariablesDto {

    private String name;

    private String type;

    private Double double_;

    private Long long_;

    private String text;

    private String text2;

    private Byte[] bytes;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getDouble_() {
        return double_;
    }

    public void setDouble_(Double double_) {
        this.double_ = double_;
    }

    public Long getLong_() {
        return long_;
    }

    public void setLong_(Long long_) {
        this.long_ = long_;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getText2() {
        return text2;
    }

    public void setText2(String text2) {
        this.text2 = text2;
    }

    public Byte[] getBytes() {
        return bytes;
    }

    public void setBytes(Byte[] bytes) {
        this.bytes = bytes;
    }
}
