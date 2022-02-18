<h1 align="center">
  <a href="https://github.com/radiopanel/radiopanel">
    <!-- Please provide path to your logo here -->
    <img src="docs/images/logo.png" alt="Logo" width="100" height="100">
  </a>
</h1>

<div align="center">
  Radiopanel
  <br />
  <!-- <a href="#about"><strong>Explore the screenshots »</strong></a> -->
  <br />
  <br />
  <a href="https://github.com/radiopanel/radiopanel/issues/new?assignees=&labels=bug&template=01_BUG_REPORT.md&title=bug%3A+">Report a Bug</a>
  ·
  <a href="https://github.com/radiopanel/radiopanel/issues/new?assignees=&labels=enhancement&template=02_FEATURE_REQUEST.md&title=feat%3A+">Request a Feature</a>
  ·
  <a href="https://github.com/radiopanel/radiopanel/discussions">Ask a Question</a>
</div>

<div align="center">
<br />

[![license](https://img.shields.io/github/license/radiopanel/radiopanel.svg?style=flat-square)](LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fradiopanel%2Fradiopanel.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fradiopanel%2Fradiopanel?ref=badge_shield)

[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/radiopanel/radiopanel/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![code with hearth by radiopanel](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-radiopanel-ff1414.svg?style=flat-square)](https://github.com/radiopanel)

</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Support](#support)
- [Project assistance](#project-assistance)
- [Contributing](#contributing)
- [Authors & contributors](#authors--contributors)
- [Security](#security)
- [License](#license)
- [Acknowledgements](#acknowledgements)

</details>

---

## About

Radiopanel provides a fast and easy way to manage your radio, 100% free of charge.

<!-- <details>
<summary>Screenshots</summary>
<br>

> **[?]**
> Please provide your screenshots here.

|                               Home Page                               |                               Login Page                               |
| :-------------------------------------------------------------------: | :--------------------------------------------------------------------: |
| <img src="docs/images/screenshot.png" title="Home Page" width="100%"> | <img src="docs/images/screenshot.png" title="Login Page" width="100%"> |

</details> -->

### Built With

- NodeJS
- NestJS
- Angular

## Support

RadioPanel open source project. It can grow thanks to the sponsors and support by the amazing backers
<table style="text-align:center;"><tr>
<td>
<a href="https://mixup.fm" target="_blank"><img src="docs/images/mixup.png" height="120" valign="middle" /></a></td>
</tr></table>

## Getting Started

If you are just trying to run radiopanel, and not develop for it. You can find a guide to just get radiopanel running from prebuild images here: https://docs.radiopanel.co/installation-and-setup/installing-radiopanel

### Prerequisites

- [Docker](https://www.docker.com/)

### Installation

1. Copy `.env.sample` to `.env` and if needed change variables.
2. Build your docker container with `docker-compose build`.

## Usage

Start the application with `docker-compose up`, the postgres and redis services will be automatically started.
You can find the application running on [http://localhost:3051](http://localhost:3051)

## Roadmap

See the [open issues](https://github.com/radiopanel/radiopanel/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/radiopanel/radiopanel/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/radiopanel/radiopanel/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/radiopanel/radiopanel/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Reach out to the maintainer at one of the following places:

- [GitHub discussions](https://github.com/radiopanel/radiopanel/discussions)
- [Discord](https://discord.gg/Be4QrEv)

## Project assistance

If you want to say **thank you** or/and support active development of Radiopanel:

- Add a [GitHub Star](https://github.com/radiopanel/radiopanel) to the project.
- Tweet about the Radiopanel on your Twitter.
- Write interesting articles about the project on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or personal blog.

Together, we can make Radiopanel **better**!

## Contributing

First off, thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

We have set up a separate document containing our [contribution guidelines](docs/CONTRIBUTING.md).

Thank you for being involved!

## Authors & contributors

The original setup of this repository is by [Felikx Van Saet](https://github.com/radiopanel).

For a full list of all authors and contributors, check [the contributor's page](https://github.com/radiopanel/radiopanel/contributors).

## Security

Radiopanel follows good practices of security, but 100% security can't be granted in software.
Radiopanel is provided **"as is"** without any **warranty**. Use at your own risk.

_For more info, please refer to the [security](docs/SECURITY.md)._

## License

This project is licensed under the **GNU General Public License v3**.

See [LICENSE](LICENSE) for more information.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fradiopanel%2Fradiopanel.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fradiopanel%2Fradiopanel?ref=badge_large)
