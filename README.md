# @freshes/icons

# svg icon from iOS, Android and iconic.

## Usage

``` vue
<template>
  <div>
    <mn-icon :name="atIcon"></mn-icon>
  </div>
</template>

<script>
  import { btn } from '@humans/btn'

  export default {
    components: {
      ...btn
    },
    data () {
      return {
        atIcon: require('@freshes/icons/js/ios/ios-at')
      }
    }
  }
</script>
```

## Contribute

#### install

``` bash
$ yarn install
```

``` bash
# Run script and to convert svg file to javascript file
$ yarn run build
```
