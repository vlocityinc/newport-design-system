package ui.interaction.builder.components.configuration;

import java.util.logging.Logger;
import org.auraframework.adapter.ComponentLocationAdapter;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * Spring configuration to autoscan all Aura and LWC packages within the module.
 */
@Import({ UIInteractionBuilderComponentLocator.class })
@Lazy
public class UIInteractionBuilderComponentsAutoConfiguration {
}

/**
 * A ComponentLocationAdapter that registers LWC and / or Aura components for
 * the module.
 */
@Component
@Lazy
class UIInteractionBuilderComponentLocator extends ComponentLocationAdapter.Impl {

        private static final Logger log = Logger
                        .getLogger(UIInteractionBuilderComponentsAutoConfiguration.class.getName());

        /**
         * The runtime-determined root folder from which the module is being executed.
         *
         * The call to getPath() will provide a folder location akin to
         * /Users/person/gitRepos/ui-b2b-components/target/classes, so we take the
         * folder two parents up.
         */
        private static final File moduleRootFolder = new File(UIInteractionBuilderComponentsAutoConfiguration.class
                        .getProtectionDomain().getCodeSource().getLocation().getPath()).getParentFile().getParentFile()
                                        .getParentFile();

        /**
         * Gets a module-relative folder given a path.
         *
         * @param moduleRelativePath A path, relative to the module root.
         *
         * @return A handle to the folder at the specified module-relative location.
         */
        private static File getModuleFolder(String moduleRelativePath) {
                return new File(moduleRootFolder, moduleRelativePath);
        }

        /**
         * Initializes a new instance that registers LWC components.
         */
        public UIInteractionBuilderComponentLocator() {
                super(getModuleFolder("src/main/components"), "ui-interaction-builder-components",
                                getModuleFolder("src/main/modules"), "ui-interaction-builder-modules");
                log.info("Registered ui-interaction-builder modules: "
                                + getModuleFolder("src/main/modules").getAbsolutePath());
        }
}
