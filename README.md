# Zippr

## Introduction

Zippr is a blazingly fast url shorter built using [Hono](https://hono.dev/) and [CF KVs](https://developers.cloudflare.com/kv/).

## How it works

Couldn't be simpler:

### Shorten a link

#### Request

```bash
curl -X POST -d '{"url":"https://example.com"}' https://zippr.dev/zip
```

#### Example Response

```bash
{"url":"https://zippr.dev/yTS6E"}
```
