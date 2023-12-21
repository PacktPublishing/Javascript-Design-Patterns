import { Formik } from 'formik';

export function FormikIntegrationExample() {
  return (
    <Formik
      initialValues={{ name: '' }}
      validate={(values) => {
        const errors = {};

        if (!values.name) {
          errors.name = 'Required';
        } else if (values.name.length < 2) {
          errors.name = 'Name too short';
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));

          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <fieldset>
            <div>
              <label htmlFor="name">
                Name (Required)
                <br />
                {errors.name && touched.name ? (
                  <>Error: {errors.name}</>
                ) : (
                  <>&nbsp;</>
                )}
              </label>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              aria-required="true"
            />
          </fieldset>

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
}
