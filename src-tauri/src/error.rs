use serde::{ser::Serializer, Serialize};
use anyhow;

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
pub enum CommandError {
  #[error(transparent)]
  RusqliteError(#[from] rusqlite::Error),
  #[error("{0}")]
  API(String),
  #[error("UnknownError: {message}")]
  #[allow(dead_code)]
  UnknownError { message: String },
}

// we must manually implement serde::Serialize
impl Serialize for CommandError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
      S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

pub type CommandResult<T, E = CommandError> = anyhow::Result<T, E>;
