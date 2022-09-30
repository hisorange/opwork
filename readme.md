# OpWork - Self Hosted Workerd

[![Build - Docker Runtime](https://github.com/hisorange/opwork/actions/workflows/cd-runtime.yml/badge.svg?branch=main)](https://github.com/hisorange/opwork/actions/workflows/cd-runtime.yml)
![Docker Pulls](https://img.shields.io/docker/pulls/opwork/runtime?label=Docker%20Pulls)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/opwork/runtime?label=Docker%20Image)
![GitHub last commit](https://img.shields.io/github/last-commit/hisorange/opwork?label=Last%20Update)
![License](https://img.shields.io/github/license/hisorange/opwork?label=License)

---

OpWork is a management interface built for CloudFlare's [Workerd](https://github.com/cloudflare/workerd) checkout the [demo instance](https://runtime.opwork.dev).

### Getting Started

Single line to install, that's all what you need.

```bash
docker run -it -80:3000 opwork/runtime:latest
```

Then visit the [localhost](http://localhost) address to see the administration page.

### Roadmap

- [x] Dockerized instance
- [x] Demo site
- [ ] Persistent storage
- [ ] Authentication
- [ ] Log collector
- [ ] Community share platform
- [ ] Web based code editor
- [ ] Usage monitor
- [ ] Documentation
- [ ] Multi node deployment
