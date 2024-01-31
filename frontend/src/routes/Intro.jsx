import React, { Component } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
const Intro = (props) => {
  const vis_list = ["box", "histogram", "violin"];
  const DEFAULT_ENTROPY = 16;
  const vis_type = vis_list[Math.floor(Math.random() * vis_list.length)];
  const user = navigator.userAgent;
  const browser_supported =
    user.includes("Chrome") ||
    user.includes("Mozilla") ||
    user.includes("Safari");
  var mobile_device =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  function randomBytes(size) {
    if (Number.isInteger(size)) {
      return window.crypto.getRandomValues(new Uint8Array(size));
    }
    throw new TypeError("The argument must be an integer.");
  }

  const navigate = useNavigate();
  const tokenUrlsafe = (numBytes = DEFAULT_ENTROPY) =>
    window
      .btoa(String.fromCharCode(...randomBytes(numBytes)))
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  const toExp = () => {
    window.sessionStorage.setItem("vis_type", vis_type);
    window.sessionStorage.setItem("user_id", tokenUrlsafe());
    window.sessionStorage.setItem("remaining_time", 20 * 60 * 1000);

    navigate("/search", {
      state: {
        vis_type: vis_type,
      },
    });
  };

  return (
    <>
      {mobile_device || !browser_supported ? (
        <div className={"justify-content-center"}>
          <div className={"text-box text-justify"}>
            <p>Sorry, your browser or mobile device is not supported.</p>
            <p>
              Please download{" "}
              <a href={"https://www.mozilla.org/en-US/firefox/new/"}>Firefox</a>{" "}
              (version 80 or newer) or{" "}
              <a href={"https://www.google.com/chrome/"}>Chrome</a> (version 85
              or newer) on your computer and try again.
            </p>
          </div>
        </div>
      ) : (
        <div className={"justify-content-center flex my-16 relative"}>
          <div className={"text-box w-2/4 justify-center items-center"}>
            <p>
              We invite you to participate in a research study being conducted
              by investigators from Washington University in St. Louis. The
              purpose of the study is to investigate how different
              visualizations of AI transcription uncertainty affects performance
              and workflow in an analytical task. The results of this study will
              help improve human-machine teaming in the future.
            </p>

            <p>
              If you agree to participate, we would like you to sift through an
              audio file and its transcription to answer several questions. It
              will take approximately <b>20 minutes</b>. You will receive a{" "}
              <b>base pay of $5.00</b> for your participation, and an
              opportunity to receive additional bonuses of up to $4.00 for
              completing this study.
            </p>

            <p>
              Taking part in this research study is completely voluntary. You
              may choose not to take part at all. If you decide to be in this
              study, you may stop participating at any time. Any data that was
              collected as part of your participation in the study will remain
              as part of the study records and cannot be removed. As a part of
              this study:
            </p>
            <ul>
              <li>
                <b>
                  We will not collect your name or any identifying information
                  about you. It will not be possible to link you to your
                  responses on the survey.
                </b>
              </li>

              <li>
                We will store information about your mouse interaction (e.g.
                what you clicked) when interacting with the system and answering
                the survey questions.
              </li>

              <li>
                We may allow other researchers to use the interaction data that
                we collect. Researchers from other universities can request to
                use the data.
              </li>
            </ul>

            <p>
              We encourage you to ask questions. If you have any questions about
              the research study itself, please contact: Alvitta Ottley
              (alvitta@wustl.edu). If you have questions, concerns, or
              complaints about your rights as a research participant, please
              contact the Human Research Protection Office at 660 South Euclid
              Avenue, Campus Box 8089, St. Louis, MO 63110, 1-(800)-438-0445 or
              email hrpo@wusm.wustl.edu. General information about being a
              research participant can be found on the Human Research Protection
              Office web site, http://hrpo.wustl.edu/. To offer input about your
              experiences as a research participant or to speak to someone other
              than the research staff, call the Human Research Protection Office
              at the number above. Thank you very much for your consideration of
              this research study.
            </p>

            <div className="flex justify-center items-center">
              <Button color="dark" onClick={toExp} className={"btn-sm"}>
                I agree to participate.
              </Button>
            </div>

            <p className={"text-box"}></p>
          </div>
        </div>
      )}
    </>
  );
};

export default Intro;
