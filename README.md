# Human svg icon from iconic
### Provide two versions, they are SVG and JS string.

The tool is just designed for vue-human.

## Usage

``` vue
<template>
  <div>
    <!-- mn-icon component from vue-human -->
    <mn-icon :name="iosAt"></mn-icon>
  </div>
</template>

<script>
  import iosAt from 'human-icons/js/ios/ios-at'

  export default {
    data () {
      return {
        iosAt
      }
    }
  }
</script>
```

## Build

``` bash

# Step 1. Install
yarn install

# Step 2. Run script and to convert svg file to javascript file
node index.js

# Step 4. Find js files from `./js`
```
