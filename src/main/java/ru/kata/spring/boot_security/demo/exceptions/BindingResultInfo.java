package ru.kata.spring.boot_security.demo.exceptions;

public class BindingResultInfo {
    String message;

    public BindingResultInfo(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
