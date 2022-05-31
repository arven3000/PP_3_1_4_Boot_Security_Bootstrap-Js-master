package ru.kata.spring.boot_security.demo.exceptions;

public class BindingResultException {

    String info;

    public BindingResultException(String info) {
        this.info = info;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
