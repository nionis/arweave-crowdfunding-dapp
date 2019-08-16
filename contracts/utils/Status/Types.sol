pragma solidity ^0.5.8;

library TStatus {
  enum Status {
    PENDING,
    STARTED,
    SUCCESS,
    FAILURE
  }
}