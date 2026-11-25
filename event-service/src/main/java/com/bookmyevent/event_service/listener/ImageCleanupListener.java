package com.bookmyevent.event_service.listener;

import com.bookmyevent.event_service.service.StorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Deletes files from MinIO only after the database change is committed. If the transaction
 * rolls back, the record still points at its file, so nothing is removed.
 */
@Slf4j
@Component
public class ImageCleanupListener {

    @Autowired
    private StorageService storageService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onImageRemoved(ImageRemovedEvent event) {
        try {
            storageService.deleteObject(event.imageKey());
        } catch (RuntimeException ex) {
            // The record is already gone, so don't fail the request; the file is just left behind.
            log.warn("Could not delete {} from storage", event.imageKey(), ex);
        }
    }
}
