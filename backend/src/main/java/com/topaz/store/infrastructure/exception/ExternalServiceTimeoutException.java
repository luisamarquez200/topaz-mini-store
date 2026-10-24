package com.topaz.store.infrastructure.exception;

public class ExternalServiceTimeoutException extends ExternalServiceException {
    public ExternalServiceTimeoutException(String message) {
        super(message);
    }

    public ExternalServiceTimeoutException(String message, Throwable cause) {
        super(message, cause);
    }
}
