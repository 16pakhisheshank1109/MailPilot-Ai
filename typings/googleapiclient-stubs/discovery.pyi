from typing import Any

__all__ = ["build", "build_from_document", "fix_method_name", "key2param"]


def build(
    serviceName: str,
    version: str,
    *,
    http: Any | None = ...,
    discoveryServiceUrl: str | None = ...,
    developerKey: str | None = ...,
    model: Any | None = ...,
    requestBuilder: Any = ...,
    credentials: Any | None = ...,
    cache_discovery: bool = ...,
    cache: Any | None = ...,
    client_options: Any | None = ...,
    adc_cert_path: str | None = ...,
    adc_key_path: str | None = ...,
    num_retries: int = ...,
    static_discovery: bool | None = ...,
    always_use_jwt_access: bool = ...,
) -> Any: ...


def build_from_document(
    service: str | dict[str, Any],
    *,
    base: str | None = ...,
    future: str | None = ...,
    http: Any | None = ...,
    developerKey: str | None = ...,
    model: Any | None = ...,
    requestBuilder: Any = ...,
    credentials: Any | None = ...,
    client_options: Any | None = ...,
    adc_cert_path: str | None = ...,
    adc_key_path: str | None = ...,
    always_use_jwt_access: bool = ...,
) -> Any: ...


def fix_method_name(name: str) -> str: ...


def key2param(key: str) -> str: ...