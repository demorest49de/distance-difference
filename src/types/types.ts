export type GeoSuggestResponse = {
  results: GeoSuggestResponseResults[]
}

export type GeoSuggestResponseResults = {
  title: {
    text: string
    hl: {
      begin: number
      end: number
    }[]
  }
  subtitle: {
    text: string
  }
  tags: string[]
  distance: {
    text: string
    value: number
  }
  address: {
    formatted_address: string
    component: {
      name: string
      kind: string[]
    }[]
  }
  uri: string
}

export type GeoCoderResponse = {
  response: {
    GeoObjectCollection: {
      featureMember: {
        GeoObject: {
          Point: {
            pos: string
          }
        }
      }[]
    }
  }
}
