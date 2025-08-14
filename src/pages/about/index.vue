<template>
  <v-container fluid>
    <h1 class="text-h4 mb-3">{{ $t('pageAboutTitle') }}</h1>
    <v-divider class="mb-3" />
    <div v-html="$t('pageAboutText')" />

    <v-row>
      <v-col :cols="12" :md="4" class="d-flex flex-column">
        <v-card class="d-flex flex-column flex-grow-1">
          <v-img :src="imgGithub" max-height="200px" class="ma-10" />
          <v-card-title>{{ $t('pageAboutCardGithubTitle') }}</v-card-title>
          <v-card-text class="flex-grow-1">{{ $t('pageAboutCardGithubText') }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" target="_blank" href="https://github.com/sebastian-raubach/frickl-web">{{ $t('buttonGo') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="12" :md="4" class="d-flex flex-column">
        <v-card class="d-flex flex-column flex-grow-1">
          <v-img :src="imgDocker" max-height="200px" class="ma-10" />
          <v-card-title>{{ $t('pageAboutCardDockerTitle') }}</v-card-title>
          <v-card-text class="flex-grow-1">{{ $t('pageAboutCardDockerText') }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" target="_blank" href="https://github.com/sebastian-raubach/frickl-web/tree/master/docker">{{ $t('buttonGo') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="12" :md="4" class="d-flex flex-column">
        <v-card class="d-flex flex-column flex-grow-1">
          <v-img :src="imgSponsor" max-height="200px" class="ma-10" />
          <v-card-title>{{ $t('pageAboutCardSponsorTitle') }}</v-card-title>
          <v-card-text class="flex-grow-1">{{ $t('pageAboutCardSponsorText') }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" target="_blank" href="https://github.com/sponsors/sebastian-raubach">{{ $t('buttonGo') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import imgGithub from '@/assets/about-github.svg'
import imgDocker from '@/assets/about-docker.svg'
import imgSponsor from '@/assets/about-sponsor.svg'

export default {
  data: function () {
    return {
      imgGithub,
      imgDocker,
      imgSponsor
    }
  }
}
</script>
