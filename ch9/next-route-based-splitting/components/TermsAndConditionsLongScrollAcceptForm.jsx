import React from 'react';
import dynamic from 'next/dynamic';
import { InView } from 'react-intersection-observer';

const TermsForm = dynamic(() => import('./TermsForm.jsx'));

// import { useInView } from 'react-intersection-observer';
// function DisplayOnVisible({ Component }) {
//   const { ref: intersectionRef, inView } = useInView({
//     threshold: 0,
//   });
//   return (
//     <>
//       <span style={{ visibility: 'hidden' }} ref={intersectionRef}></span>
//       {inView && <Component />}
//     </>
//   );
// }

export function TermsAndConditions() {
  return (
    <>
      <h3>Terms and Conditions Long Scroll Accept Form</h3>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Proin nibh nisl
        condimentum id venenatis. Felis bibendum ut tristique et egestas quis
        ipsum suspendisse. Auctor augue mauris augue neque gravida in fermentum.
        Sit amet luctus venenatis lectus magna fringilla urna porttitor. Euismod
        nisi porta lorem mollis aliquam ut porttitor leo. Lobortis mattis
        aliquam faucibus purus in massa tempor. In massa tempor nec feugiat
        nisl. Cursus turpis massa tincidunt dui ut ornare lectus sit amet.
        Pretium vulputate sapien nec sagittis. Porta lorem mollis aliquam ut
        porttitor leo. Massa massa ultricies mi quis hendrerit dolor magna eget
        est. Nunc sed velit dignissim sodales. Bibendum est ultricies integer
        quis auctor. Mattis enim ut tellus elementum sagittis vitae et.
        Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget
        nullam.
      </p>

      <p>
        Porttitor lacus luctus accumsan tortor posuere ac ut. Eget duis at
        tellus at urna. In massa tempor nec feugiat nisl pretium fusce id.
        Tortor at risus viverra adipiscing at in tellus. Laoreet suspendisse
        interdum consectetur libero. Eget felis eget nunc lobortis mattis.
        Tempus egestas sed sed risus pretium quam vulputate dignissim
        suspendisse. Habitant morbi tristique senectus et netus et malesuada
        fames. Nisi est sit amet facilisis. Lacus sed viverra tellus in. Ut enim
        blandit volutpat maecenas volutpat blandit aliquam etiam erat. Lorem
        ipsum dolor sit amet consectetur. Velit dignissim sodales ut eu sem
        integer vitae. Odio aenean sed adipiscing diam donec adipiscing
        tristique risus. Ut lectus arcu bibendum at varius vel pharetra vel
        turpis. Nec ullamcorper sit amet risus nullam eget felis eget. Turpis
        nunc eget lorem dolor sed viverra ipsum.
      </p>

      <p>
        In dictum non consectetur a erat nam. Vel orci porta non pulvinar neque
        laoreet suspendisse interdum. Vel fringilla est ullamcorper eget nulla.
        Varius duis at consectetur lorem donec. Ipsum dolor sit amet
        consectetur. Nunc eget lorem dolor sed viverra ipsum. Lectus sit amet
        est placerat in egestas erat imperdiet. Mauris commodo quis imperdiet
        massa tincidunt nunc pulvinar sapien et. Ut venenatis tellus in metus
        vulputate. Libero enim sed faucibus turpis. Vel risus commodo viverra
        maecenas accumsan lacus vel facilisis. Facilisis volutpat est velit
        egestas dui id ornare arcu odio.
      </p>

      <p>
        Etiam erat velit scelerisque in. Tincidunt augue interdum velit euismod.
        Ultricies mi eget mauris pharetra et ultrices. Ut consequat semper
        viverra nam libero justo laoreet sit amet. Vel quam elementum pulvinar
        etiam. Eu scelerisque felis imperdiet proin. Pellentesque pulvinar
        pellentesque habitant morbi tristique senectus et netus. Pharetra diam
        sit amet nisl. Cursus sit amet dictum sit amet. Vitae turpis massa sed
        elementum tempus egestas sed sed risus. Id aliquet risus feugiat in ante
        metus. Vitae congue mauris rhoncus aenean. Volutpat commodo sed egestas
        egestas fringilla. Ultricies lacus sed turpis tincidunt id aliquet risus
        feugiat in. Aenean pharetra magna ac placerat vestibulum lectus mauris.
        Tellus elementum sagittis vitae et leo duis ut diam quam. Vitae nunc sed
        velit dignissim. Aliquam nulla facilisi cras fermentum odio eu feugiat
        pretium. Interdum posuere lorem ipsum dolor sit.
      </p>

      <p>
        In nibh mauris cursus mattis molestie a iaculis at. Sapien pellentesque
        habitant morbi tristique senectus et netus et. Urna molestie at
        elementum eu. Pellentesque id nibh tortor id aliquet lectus proin nibh.
        Interdum posuere lorem ipsum dolor. Consectetur adipiscing elit
        pellentesque habitant morbi. Donec et odio pellentesque diam volutpat
        commodo sed. In pellentesque massa placerat duis ultricies lacus. Quam
        nulla porttitor massa id. Aliquet sagittis id consectetur purus ut
        faucibus pulvinar. Cursus vitae congue mauris rhoncus. Molestie a
        iaculis at erat pellentesque adipiscing commodo. Feugiat sed lectus
        vestibulum mattis ullamcorper velit sed.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Proin nibh nisl
        condimentum id venenatis. Felis bibendum ut tristique et egestas quis
        ipsum suspendisse. Auctor augue mauris augue neque gravida in fermentum.
        Sit amet luctus venenatis lectus magna fringilla urna porttitor. Euismod
        nisi porta lorem mollis aliquam ut porttitor leo. Lobortis mattis
        aliquam faucibus purus in massa tempor. In massa tempor nec feugiat
        nisl. Cursus turpis massa tincidunt dui ut ornare lectus sit amet.
        Pretium vulputate sapien nec sagittis. Porta lorem mollis aliquam ut
        porttitor leo. Massa massa ultricies mi quis hendrerit dolor magna eget
        est. Nunc sed velit dignissim sodales. Bibendum est ultricies integer
        quis auctor. Mattis enim ut tellus elementum sagittis vitae et.
        Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget
        nullam.
      </p>

      <p>
        Porttitor lacus luctus accumsan tortor posuere ac ut. Eget duis at
        tellus at urna. In massa tempor nec feugiat nisl pretium fusce id.
        Tortor at risus viverra adipiscing at in tellus. Laoreet suspendisse
        interdum consectetur libero. Eget felis eget nunc lobortis mattis.
        Tempus egestas sed sed risus pretium quam vulputate dignissim
        suspendisse. Habitant morbi tristique senectus et netus et malesuada
        fames. Nisi est sit amet facilisis. Lacus sed viverra tellus in. Ut enim
        blandit volutpat maecenas volutpat blandit aliquam etiam erat. Lorem
        ipsum dolor sit amet consectetur. Velit dignissim sodales ut eu sem
        integer vitae. Odio aenean sed adipiscing diam donec adipiscing
        tristique risus. Ut lectus arcu bibendum at varius vel pharetra vel
        turpis. Nec ullamcorper sit amet risus nullam eget felis eget. Turpis
        nunc eget lorem dolor sed viverra ipsum.
      </p>

      <p>
        In dictum non consectetur a erat nam. Vel orci porta non pulvinar neque
        laoreet suspendisse interdum. Vel fringilla est ullamcorper eget nulla.
        Varius duis at consectetur lorem donec. Ipsum dolor sit amet
        consectetur. Nunc eget lorem dolor sed viverra ipsum. Lectus sit amet
        est placerat in egestas erat imperdiet. Mauris commodo quis imperdiet
        massa tincidunt nunc pulvinar sapien et. Ut venenatis tellus in metus
        vulputate. Libero enim sed faucibus turpis. Vel risus commodo viverra
        maecenas accumsan lacus vel facilisis. Facilisis volutpat est velit
        egestas dui id ornare arcu odio.
      </p>

      <p>
        Etiam erat velit scelerisque in. Tincidunt augue interdum velit euismod.
        Ultricies mi eget mauris pharetra et ultrices. Ut consequat semper
        viverra nam libero justo laoreet sit amet. Vel quam elementum pulvinar
        etiam. Eu scelerisque felis imperdiet proin. Pellentesque pulvinar
        pellentesque habitant morbi tristique senectus et netus. Pharetra diam
        sit amet nisl. Cursus sit amet dictum sit amet. Vitae turpis massa sed
        elementum tempus egestas sed sed risus. Id aliquet risus feugiat in ante
        metus. Vitae congue mauris rhoncus aenean. Volutpat commodo sed egestas
        egestas fringilla. Ultricies lacus sed turpis tincidunt id aliquet risus
        feugiat in. Aenean pharetra magna ac placerat vestibulum lectus mauris.
        Tellus elementum sagittis vitae et leo duis ut diam quam. Vitae nunc sed
        velit dignissim. Aliquam nulla facilisi cras fermentum odio eu feugiat
        pretium. Interdum posuere lorem ipsum dolor sit.
      </p>

      <p>
        In nibh mauris cursus mattis molestie a iaculis at. Sapien pellentesque
        habitant morbi tristique senectus et netus et. Urna molestie at
        elementum eu. Pellentesque id nibh tortor id aliquet lectus proin nibh.
        Interdum posuere lorem ipsum dolor. Consectetur adipiscing elit
        pellentesque habitant morbi. Donec et odio pellentesque diam volutpat
        commodo sed. In pellentesque massa placerat duis ultricies lacus. Quam
        nulla porttitor massa id. Aliquet sagittis id consectetur purus ut
        faucibus pulvinar. Cursus vitae congue mauris rhoncus. Molestie a
        iaculis at erat pellentesque adipiscing commodo. Feugiat sed lectus
        vestibulum mattis ullamcorper velit sed.
      </p>
      <hr />
      <InView>
        {({ inView, ref }) => <div ref={ref}>{inView && <TermsForm />}</div>}
      </InView>
      <label htmlFor="accept">
        <input id="accept" name="acceptTerms" type="checkbox" />
        Accept Terms and Conditions
      </label>
    </>
  );
}
