package org.camunda.bpm.cockpit.plugin.centaur.db;

public class InstanceVariablesDto {

    private String act_id;

    private String id;

    private String name;

    private String type;

    private Double double_;

    private Long long_;

    private String text;

    private String text2;

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAct_id() {
        return act_id;
    }

    public void setAct_id(String act_id) {
        this.act_id = act_id;
    }
}
