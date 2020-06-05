# Getting Started

This page will you show you how to get started with Newport, from cloning it to disk from github to running the preview tool.

## 1. Clone the github repo:

```
git clone git@github.com:vlocityinc/newport-design-system.git
cd newport-design-system
```

### 1 a) Optional Step - change the branch to the that matches your installed Vlocity Salesforce managed package.

For example if your managed package is Insurance v106 then run:

```
git checkout ins-106.0
```

You can see all available branches by running:

```
git branch -ls
```

If you're unsure which one to use then ask your Vlocity Support Rep to help you choose correctly.

## 2. Install the dependencies and start the preview tool:

```
npm install
npm start
```

## 3. Open the preview tool in your web browser

The link for the preview tool should be in your terminal, but it is usually hosted at: [http://localhost:6006](http://localhost:6006)

![Preview tool](./docs/previewer.v1.png)
