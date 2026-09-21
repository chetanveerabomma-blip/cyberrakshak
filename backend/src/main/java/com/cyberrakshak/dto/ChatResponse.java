package com.cyberrakshak.dto;

public class ChatResponse {
    private String response;

    public ChatResponse() {}

    public ChatResponse(String response) {
        this.response = response;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String response;
        public Builder response(String response) { this.response = response; return this; }
        public ChatResponse build() { return new ChatResponse(response); }
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
