use std::time::{Duration, SystemTime, UNIX_EPOCH};

pub fn now() -> i64 {
    let now = SystemTime::now();
    let since_the_epoch = now
        .duration_since(UNIX_EPOCH)
        .unwrap_or(Duration::new(0, 0));

    since_the_epoch.as_millis().min(i64::MAX as u128) as i64
}
