- #### Home miners

  - Need a fancy gui app that will explain the process etc
  - Mainly 1 GPU 1-n drives scenario
  - #Init / resume /grow/shrink for "local" machine only
  - Some fancy progress etc
  - "As easy as possible" (easier than #Smapp with deps)




# Init

Explain the process in detail - infographic/animation? +docs, tooltips and clear steps

## Select Directory

* [ ] select dir (handle errors - not enough space, dir not available, no permissions, no dir selected, the same dir selected)
* [ ] save and show in summary
* [ ] check the available space
* [ ] check disk IO speed
* [ ] info on why choosing a good location is crucial

## Data Size

pos data

* [ ] space units calculations vs what's shown
* [ ] input to choose the amount of space by steps (SU)
* [ ] save and keep in a variable for summary and other components
* [ ] Verify dynamically if not surpassing max suggested value
* [ ] do not allow less that minimum
* [ ] round up to the full space units when input manual
* [ ] dynamically modify the units (GiB/TiB/PiB)
* [ ] calculate rewards amount example?

max file size

* [ ] max file size default setup
* [ ] input to choose the amount of space by steps (in MiB)
* [ ] warn about the FS limitations
* [ ] explanation and info that it's safe to leave default
* [ ] calculate the number of files that will be generated

## Find Provider

* [ ] find processors (only local machine)
* [ ] display all the processors details
* [ ] select automatically the fastest
* [ ] allow selecting other
* [ ] save the choice as the int accordindly
* [ ] show calculated speed
* [ ] show calulated total time of pos generation (with * that it only counts the perfect conditions)
