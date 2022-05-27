<template>
  <vue-form :state="formstate" @submit.prevent="onSubmit">
    <b-row align-h="center">
      <b-col cols="9" v-for="field in fields" :key="field.key">
        <validate
          class="form-group"
          :class="fieldClassName(formstate[field.key])"
        >
          <label>
            {{ field.label }}
            <span class="text-danger font-weight-bold" v-if="field.required">
              *
            </span>
          </label>
          <input
            v-model.lazy="models[field.key]"
            :required="field.required"
            :name="field.key"
            :type="field.type || 'text'"
            class="form-control"
            :min="field.min"
            :max="field.max"
            :passwd="field.passwd"
            :minlength="field.minlength"
            :class="fieldClassName(formstate[field.key])"
          />
          <field-messages
            class="form-control-feedback"
            :name="field.name"
            show="$touched || $submitted"
          >
            <small class="text-success font-weight-bold">
              {{ field.messages.success }}
            </small>
            <small class="text-danger font-weight-bold" slot="required">
              {{ field.messages.errors.required }}
            </small>
            <small class="text-danger font-weight-bold" slot="email">
              {{ field.messages.errors.email }}
            </small>
            <small class="text-danger font-weight-bold" slot="minlength">
              {{ field.messages.errors.minlength }}
            </small>
            <small class="text-danger font-weight-bold" slot="passwd">
              {{ field.messages.errors.passwd }}
            </small>
          </field-messages>
        </validate>
      </b-col>
    </b-row>
    <div class="py-2 text-center">
      <button class="btn btn-primary" type="submit">Enviar</button>
    </div>
  </vue-form>
</template>

<script>
export default {
  name: "VForm",
  props: {
    fields: {
      type: Array,
      require: true,
    },
    values: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      formstate: {},
      models: { ...this.values },
    };
  },
  methods: {
    onSubmit() {
      if (this.formstate.$valid) {
        this.formstate._reset();
        this.$emit("send-form", this.models);
        this.models = { ...this.values };
      }
    },
    fieldClassName(field) {
      if (!field) {
        return null;
      }
      if ((field.$touched || field.$submitted) && field.$valid) {
        return "is-valid";
      }
      if ((field.$touched || field.$submitted) && field.$invalid) {
        return "is-invalid";
      }
    },
  },
};
</script>
